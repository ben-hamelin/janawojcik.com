<?php

declare(strict_types=1);

namespace Drupal\Tests\sfds\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Test the field formatter override.
 *
 * @group sfds
 */
class FieldFormmaterOverrideTest extends BrowserTestBase {
  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'field',
    'field_ui',
    'node',
    'sfds',
    'user',
    'views',
  ];

  /**
   * Field names that should exist on the article content type.
   */
  const FIELDS = [
    'sfds_boolean' => 'boolean',
  ];

  const CONTENT_TYPES = [
    'sfds_article',
    'sfds_page',
  ];

  const DISPLAY_MODES = [
    'default',
    'teaser',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected $profile = 'minimal';

  /**
   * {@inheritdoc}
   */
  protected $adminUser;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->adminUser = $this->drupalCreateUser([
      'access content',
      'access administration pages',
      'administer site configuration',
      'administer users',
      'administer permissions',
      'administer content types',
      'administer node fields',
      'administer node display',
      'administer nodes',
      'bypass node access',
    ]);

    $this->drupalLogin($this->adminUser);

    // Add additional content types.
    foreach (self::CONTENT_TYPES as $contentType) {
      $this->setupContentType($contentType);
    }

    foreach (self::FIELDS as $name => $type) {
      $newField = TRUE;
      foreach (self::CONTENT_TYPES as $contentType) {
        $this->addField($name, $type, $contentType, $newField);
        // Configure the default display.
        $this->configureFieldDisplay($name, $contentType);
        // Configure the teaser display.
        $this->configureFieldDisplay($name, $contentType, 'teaser');

        // Create content.
        $value = $type === 'boolean' ? TRUE : $this->randomString();
        $this->createContent($contentType, $name, $value);
        $newField = FALSE;
      }
    }
  }

  /**
   * Create content to test with.
   *
   * @param string $contentType
   *   The content type to add content to.
   * @param string $fieldName
   *   The sfds field name.
   * @param mixed $value
   *   The value to provide to the field.
   *
   * @throws \Behat\Mink\Exception\ElementNotFoundException
   * @throws \Behat\Mink\Exception\ExpectationException
   */
  protected function createContent(
    string $contentType,
    string $fieldName,
    mixed $value
  ): ?int {
    // Create an article.
    $this->drupalGet("/node/add/{$contentType}");
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->fieldExists('title[0][value]');
    $this->assertSession()->fieldExists("field_{$fieldName}[value]");

    // Enable SFDS and save the form.
    $this->submitForm(
      [
        'title[0][value]' => $this->randomString(8),
        "field_{$fieldName}[value]" => $value,
      ],
      'Save'
    );
    $this->assertSession()->statusCodeEquals(200);
    $urlParts = explode('/', $this->getUrl());
    $nid = array_pop($urlParts);
    if (is_numeric($nid)) {
      return (int) $nid;
    }

    return NULL;
  }

  /**
   * Set up the content type.
   *
   * @param string $contentType
   *   The content type machine name to create.
   */
  protected function setupContentType(
    string $contentType
  ): void {
    $this->drupalGet('/admin/structure/types/add');
    $this->submitForm(
      [
        'name' => $this->randomString(),
        'type' => $contentType,
      ],
      'Save and manage fields'
    );
  }

  /**
   * Add a new field to the system.
   *
   * @param string $machineName
   *   The machine name of the field.
   * @param string $fieldType
   *   The field type.
   * @param string $contentType
   *   The content type to add the field to.
   * @param bool $isNewField
   *   Whether the field is new or being reused.
   */
  protected function addField(
    string $machineName,
    string $fieldType,
    string $contentType,
    bool $isNewField = TRUE
  ): void {
    if ($isNewField) {
      $this->drupalGet("/admin/structure/types/manage/{$contentType}/fields/add-field");
      $this->submitForm(
        [
          'new_storage_type' => $fieldType,
          'label' => $machineName,
          'field_name' => $machineName,
        ],
        'Save and continue'
      );
    }
    else {
      $this->drupalGet("/admin/structure/types/manage/{$contentType}/fields/reuse");
      $this->submitForm([], 'Re-use');
    }

  }

  /**
   * Configure the display of the field.
   *
   * @param string $machineName
   *   The machine name of the field.
   * @param string $contentType
   *   The content type to add the field to.
   * @param string $displayMode
   *   The display mode to configure.
   */
  protected function configureFieldDisplay(
    string $machineName,
    string $contentType,
    string $displayMode = 'default'
  ): void {
    $path = "/admin/structure/types/manage/{$contentType}/display";
    if ($displayMode !== 'default') {
      $path .= "/{$displayMode}";
    }
    $this->drupalGet($path);
    $this->submitForm(
      [
        "fields[field_{$machineName}][region]" => 'content',
        "fields[field_{$machineName}][label]" => $displayMode === 'default' ? 'above' : 'hidden',
      ],
      'Save'
    );
  }

  /**
   * Toggle the SFDS settings for a field storage.
   *
   * @param string $fieldName
   *   The field name to toggle.
   * @param bool $value
   *   The value to set.
   * @param string $mode
   *   The mode to choose.
   * @param string|null $bundle
   *   The bundle machine name to choose. Defaults to NULL.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   */
  protected function toggleSfds(
    string $fieldName,
    bool $value,
    string $mode,
    ?string $bundle = NULL
  ): void {
    // @todo Make the content type dynamic.
    $contentType = self::CONTENT_TYPES[0];
    $this->drupalGet("/admin/structure/types/manage/{$contentType}/fields/node.{$contentType}.field_{$fieldName}/storage");
    $formValues = [
      'sfds_enabled' => $value,
      'sfds_mode' => $mode,
    ];

    if (!is_null($bundle)) {
      $formValues['sfds_default_bundle'] = $bundle;
    }

    $this->submitForm(
      $formValues,
      'Save field settings'
    );
    $this->assertSession()->statusCodeEquals(200);
  }

  /**
   * Tests that the shared field display settings are saved.
   */
  public function testSharedFieldDisplaySettingsPerBundle(): void {
    // Go to the default home page.
    $this->drupalGet("/node");
    $this->assertSession()->statusCodeEquals(200);

    foreach (self::FIELDS as $label => $type) {
      // This is a teaser view, which should not have the label displayed.
      $this->assertSession()->pageTextNotContains($label);
    }

    // Enable per-bundle defaults for the fields.
    foreach (self::FIELDS as $label => $type) {
      $this->toggleSfds($label, TRUE, 'bundle');
    }

    // Go back to the home page.
    $this->drupalGet("/node");

    foreach (self::FIELDS as $label => $type) {
      // This is a teaser view, using the bundle default,
      // which should have the label displayed.
      $this->assertSession()->pageTextContains($label);
    }

    // @todo Add tests for the anonymous user.
  }

  /**
   * Tests that the shared field display settings are saved globally.
   */
  public function testSharedFieldDisplaySettingsGlobally(): void {
    // Go to the default home page.
    $this->drupalGet("/node");
    $this->assertSession()->statusCodeEquals(200);

    foreach (self::FIELDS as $label => $type) {
      // This is a teaser view, which should not have the label displayed.
      $this->assertSession()->pageTextNotContains($label);
    }

    $defaultBundle = 'sfds_article';
    // Enable global settings for the fields.
    foreach (self::FIELDS as $label => $type) {
      $this->toggleSfds($label, TRUE, 'global', $defaultBundle);
    }

    // Change the default display settings for the boolean field.
    $path = "/admin/structure/types/manage/{$defaultBundle}/display";
    $this->drupalGet($path);
    $this->assertSession()->statusCodeEquals(200);
    $this->submitForm([], 'field_sfds_boolean_settings_edit');

    $this->submitForm([
      'fields[field_sfds_boolean][settings_edit_form][settings][format]' => 'custom',
      'fields[field_sfds_boolean][settings_edit_form][settings][format_custom_true]' => 'CUSTOM TRUE',
      'fields[field_sfds_boolean][settings_edit_form][settings][format_custom_false]' => 'CUSTOM FALSE',
    ],
      'Update'
    );
    $this->submitForm([], 'Save');

    $nodes = [];

    // Create new content in each bundle.
    foreach (self::CONTENT_TYPES as $contentType) {
      $nodes[] = $this->createContent($contentType, 'sfds_boolean', TRUE);
      $nodes[] = $this->createContent($contentType, 'sfds_boolean', FALSE);
    }

    foreach ($nodes as $index => $nid) {
      $this->drupalGet("/node/{$nid}");
      $this->assertSession()->statusCodeEquals(200);

      $assertText = 'CUSTOM TRUE';
      if ($index % 2 !== 0) {
        $assertText = 'CUSTOM FALSE';
      }
      $this->assertSession()->pageTextContains($assertText);
    }

    // Go back to the home page.
    $this->drupalGet("/node");

    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->pageTextMatchesCount(4, '/CUSTOM TRUE/');
    $this->assertSession()->pageTextMatchesCount(2, '/CUSTOM FALSE/');

    // @todo Add tests for the anonymous user.
  }

  /**
   * Confirm the field display settings are unaffected by SFDS.
   *
   * @see https://www.drupal.org/project/sfds/issues/3386199
   */
  public function testManageDisplayFormValues(): void {
    foreach (self::CONTENT_TYPES as $contentType) {
      // Load the default form display.
      $path = "/admin/structure/types/manage/{$contentType}/display";
      $this->drupalGet($path);
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->fieldValueEquals('fields[field_sfds_boolean][label]', 'above');

      // Load the teaser form display.
      $path = "/admin/structure/types/manage/{$contentType}/display/teaser";
      $this->drupalGet($path);
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->fieldValueEquals('fields[field_sfds_boolean][label]', 'hidden');
    }
  }

}
