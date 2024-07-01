<?php

declare(strict_types=1);

namespace Drupal\sfds;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Field\FieldTypePluginManagerInterface;
use Drupal\Core\Field\FormatterPluginManager;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\field\FieldConfigInterface;

/**
 * Plugin manager for SFDS field formatters.
 *
 * This decorates the core plugin.manager.field.formatter service to allow
 * for overriding the `viewElements` of plugins.
 */
class FormatterPluginManagerOverride extends FormatterPluginManager {

  /**
   * The original plugin.manager.field.formatter service.
   *
   * @var \Drupal\Core\Field\FormatterPluginManager
   */
  protected FormatterPluginManager $originalPluginManager;

  /**
   * The entity_type.manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * The current_route_match service.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected RouteMatchInterface $routeMatch;

  /**
   * Constructor for the FormatterPluginManagerOverride.
   *
   * @param \Drupal\Core\Field\FormatterPluginManager $originalPluginManager
   *   The original plugin.manager.field.formatter service.
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   * @param \Drupal\Core\Field\FieldTypePluginManagerInterface $field_type_manager
   *   The 'field type' plugin manager.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity_type.manager service.
   * @param \Drupal\Core\Routing\RouteMatchInterface $routeMatch
   *   The current_route_match service.
   */
  public function __construct(
    FormatterPluginManager $originalPluginManager,
    \Traversable $namespaces,
    CacheBackendInterface $cache_backend,
    ModuleHandlerInterface $module_handler,
    FieldTypePluginManagerInterface $field_type_manager,
    EntityTypeManagerInterface $entityTypeManager,
    RouteMatchInterface $routeMatch
  ) {
    $this->originalPluginManager = $originalPluginManager;
    $this->entityTypeManager = $entityTypeManager;
    $this->routeMatch = $routeMatch;

    parent::__construct($namespaces, $cache_backend, $module_handler, $field_type_manager);
  }

  /**
   * {@inheritdoc}
   */
  public function getInstance(array $options) {
    // Check the route and use defaults when on the field ui form.
    if (!empty($this->routeMatch->getRouteName()) && 
      str_starts_with($this->routeMatch->getRouteName(), 'entity.entity_view_display.')) {
      return parent::getInstance($options);
    }

    $fieldConfig = $options['field_definition'];
    // Ensure we have a FieldConfig entity.
    if (!$fieldConfig instanceof FieldConfigInterface) {
      return parent::getInstance($options);
    }

    $sfds = $fieldConfig
      ->getFieldStorageDefinition()
      ->getThirdPartySettings('sfds');

    $sfdsOptOut = $options['configuration']['third_party_settings']['sfds']['opt_out'] ?? FALSE;

    // Is the field storage configured to use shared display settings?
    // Is the field configured to opt out of shared display settings?
    if (
      !empty($sfds) &&
      $sfds['enabled'] === TRUE &&
      !$sfdsOptOut
    ) {
      $displayEntity = "{$fieldConfig->getTargetEntityTypeId()}.{$fieldConfig->getTargetBundle()}.default";
      if ($sfds['mode'] === 'global' && !empty($sfds['bundle'])) {
        $displayEntity = "{$fieldConfig->getTargetEntityTypeId()}.{$sfds['bundle']}.default";
      }

      // @todo Check if this is field display or form display.
      /** @var \Drupal\Core\Entity\EntityViewDisplayInterface $defaultDisplay */
      $defaultDisplay = $this->entityTypeManager
        ->getStorage('entity_view_display')
        ->load($displayEntity);

      $defaultDisplaySettings = $defaultDisplay->getComponent($fieldConfig->getName());
      // Guard against the field not being present on the bundle.
      if (!is_null($defaultDisplaySettings)) {
        // @todo Check if the field level settings opting out.
        // Use the default display mode settings.
        $options['view_mode'] = 'default';
        $options['configuration'] = $defaultDisplaySettings;
      }
    }

    // Default to the parent.
    return parent::getInstance($options);
  }

}
