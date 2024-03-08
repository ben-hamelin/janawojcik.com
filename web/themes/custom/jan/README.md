# starter_theme
A bare bones Drupal 9 starter theme

<ol>
<li>Move `starter_theme` into your local site under /themes/custom/SITE_THEME_NAME
</li><li>
Don’t bring along the .git folder or .gitignore file
</li><li>
Replace all filenames and code instances of “starter_theme” with the new theme name
</li><li>
Visit /admin/appearance and find your new theme, click “Install and set as default”
</li><li>
Add /themes/custom/SITE_THEME_NAME/screenshot.png
</li><li>
Review block assignments: /admin/structure/block
</li><li>
Should only be dealing with 3 regions to start; header, content, footer
</li><li>
Now we start introducing the custom theme framework. Update the 2 included global libraries 
assets/css/custom/custom.css
assets/js/custom/custom.js
https://www.drupal.org/docs/8/theming/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-theme
</li><li>
Define your conditional libraries. For any plugin or asset that is not global, you should define it as a separate library for inclusion conditionally via twig. For example, a library for fancybox could be defined, and only included from within a views-view—gallery.html.twig
</li><li>
From any .twig file you can include “{{ attach_library('SITE_THEME_NAME/CUSTOM_LIBRARY') }}
</li><li>
Introduce markup from the prototypes into the theme templates: 
/themes/custom/SITE_THEME_NAME/templates/
layout/html.html.twig
pages/page.html.twig
pages/page—front.html.twig
</li><li>
Update paths for hardcoded images and favicons, including favicon XML and JSON files if applicable.
</li><li>Continue with template overrides as needed.</li></ol>
