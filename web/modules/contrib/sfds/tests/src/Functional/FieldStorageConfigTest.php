<?php

declare(strict_types=1);

namespace Drupal\Tests\sfds\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Test the field storage config form.
 *
 * @group sfds
 */
class FieldStorageConfigTest extends BrowserTestBase {
  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'field',
    'field_ui',
    'node',
    'sfds',
    'user',
  ];

  /**
   * Field names that should exist on the article content type.
   */
  const FIELD_NAMES = [
    'body',
    'field_image',
    'field_tags',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected $profile = 'standard';

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
      'administer content types',
      'administer node fields',
      'administer node display',
      'administer users',
      'administer permissions',
    ]);
    $this->drupalLogin($this->adminUser);
  }

  /**
   * Tests that the shared field display settings are saved.
   */
  public function testSharedFieldDisplaySettingsSaved(): void {
    foreach (self::FIELD_NAMES as $field_name) {
      if ($field_name !== 'body') {
        continue;
      }

      // Confirm the field exists and is disabled by default.
      $this->drupalGet("/admin/structure/types/manage/article/fields/node.article.{$field_name}/storage");
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->fieldExists('sfds_enabled');
      $this->assertSession()->fieldValueEquals('sfds_enabled', FALSE);

      // Ensure the default values are set.
      $this->assertSession()->fieldExists('sfds_mode');
      $this->assertSession()->fieldValueEquals('sfds_mode', 'bundle');

      $this->assertSession()->fieldExists('sfds_default_bundle');
      $this->assertSession()->fieldValueEquals('sfds_default_bundle', 'article');

      // Enable SFDS and save the form.
      $this->submitForm(
        [
          'sfds_enabled' => TRUE,
          'sfds_mode' => 'bundle',
          'sfds_default_bundle' => 'page',
        ],
        'Save field settings'
      );
      $this->assertSession()->statusCodeEquals(200);

      // Let's ensure the UI is working as expected.
      // Browse to the article default display.
      $this->drupalGet('/admin/structure/types/manage/article/display');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkNotExists('Click here to manage the display settings for this field.');
      $this->drupalGet('/admin/structure/types/manage/article/display/teaser');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkExists('Click here to manage the display settings for this field.');

      // Browse to the page default display.
      $this->drupalGet('/admin/structure/types/manage/page/display');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkNotExists('Click here to manage the display settings for this field.');
      $this->drupalGet('/admin/structure/types/manage/page/display/teaser');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkExists('Click here to manage the display settings for this field.');

      // Confirm the field value was saved.
      $this->drupalGet("/admin/structure/types/manage/article/fields/node.article.{$field_name}/storage");
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->fieldExists('sfds_enabled');
      $this->assertSession()->fieldValueEquals('sfds_enabled', TRUE);

      // Ensure the values were saved.
      $this->assertSession()->fieldExists('sfds_mode');
      $this->assertSession()->fieldValueEquals('sfds_mode', 'bundle');

      $this->assertSession()->fieldExists('sfds_default_bundle');
      $this->assertSession()->fieldValueEquals('sfds_default_bundle', 'page');

      // Change to GLOBAL sfds mode and save the form.
      $this->submitForm(
        [
          'sfds_enabled' => TRUE,
          'sfds_mode' => 'global',
          'sfds_default_bundle' => 'page',
        ],
        'Save field settings'
      );
      $this->assertSession()->statusCodeEquals(200);

      // Let's ensure the UI is working as expected.
      // Browse to the article default display.
      $this->drupalGet('/admin/structure/types/manage/article/display');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkExists('Click here to manage the display settings for this field.');
      $this->drupalGet('/admin/structure/types/manage/article/display/teaser');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkExists('Click here to manage the display settings for this field.');

      // Browse to the page default display.
      $this->drupalGet('/admin/structure/types/manage/page/display');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkNotExists('Click here to manage the display settings for this field.');
      $this->drupalGet('/admin/structure/types/manage/page/display/teaser');
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->linkExists('Click here to manage the display settings for this field.');
    }
  }

  /**
   * Test the bundle validation is working.
   */
  public function testFormValidation(): void {
    foreach (self::FIELD_NAMES as $field_name) {
      if ($field_name === 'body') {
        continue;
      }
      // Confirm the field exists and is disabled by default.
      $this->drupalGet("/admin/structure/types/manage/article/fields/node.article.{$field_name}/storage");
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->fieldExists('sfds_enabled');
      $this->assertSession()->fieldValueEquals('sfds_enabled', FALSE);

      // Ensure the default values are set.
      $this->assertSession()->fieldExists('sfds_mode');
      $this->assertSession()->fieldValueEquals('sfds_mode', 'bundle');

      $this->assertSession()->fieldExists('sfds_default_bundle');
      $this->assertSession()->fieldValueEquals('sfds_default_bundle', 'article');

      // Enable SFDS and save the form with a bundle
      // that does not contain this field.
      $this->submitForm(
        [
          'sfds_enabled' => TRUE,
          'sfds_mode' => 'global',
          'sfds_default_bundle' => 'page',
        ],
        'Save field settings'
      );
      $this->assertSession()->statusCodeEquals(200);
      $this->assertSession()->pageTextContains('Error message');
    }
  }

}
