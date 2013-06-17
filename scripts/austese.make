; Core version
; ------------
; Each makefile should begin by declaring the core version of Drupal that all
; projects should be compatible with.
  
core = 7.22
  
; API version
; ------------
; Every makefile needs to declare its Drush Make API version. This version of
; drush make uses API version `2`.
  
api = 2
  
; Profiles
; --------  
projects[austese_profile][type] = "profile"
projects[austese_profile][download][type] = "git"
projects[austese_profile][download][url] = "https://github.com/uq-eresearch/austese_drupal.git"

; Core project
; ------------
; In order for your makefile to generate a full Drupal site, you must include
; a core project. This is usually Drupal core, but you can also specify
; alternative core projects like Pressflow. Note that makefiles included with
; install profiles *should not* include a core project.
  
; Drupal 7.x. Requires the `core` property to be set to 7.x.
projects[drupal][version] = 7


; Modules
; --------
; sets up the module folders - enabling of modules occurs via .info file

;projects[features][version] = 1.0
;projects[features][type] = "module"

;projects[diff][version] = 3.2
;projects[diff][type] = "module"


projects[entity][version] = 1.1
projects[entity][type] = "module"

projects[entityreference][version] = 1.0
projects[entityreference][type] = "module"

projects[ctools][version] = 1.3
projects[ctools][type] = "module"

projects[views][version] = 3.7
projects[views][type] = "module"

projects[views_bulk_operations][version] = 3.1
projects[views_bulk_operations][type] = "module"

projects[og][version] = 2.2
projects[og][type] = "module"

projects[smtp][version] = 1.0
projects[smtp][type] = "module"


projects[jquery_update][version] = 2.3
projects[jquery_update][type] = "module"

projects[openid_selector][version] = 1.x-dev
projects[openid_selector][type] = "module"

projects[austese_repository][type] = "module"
projects[austese_repository][download][type] = "git"
projects[austese_repository][download][url] = "https://github.com/uq-eresearch/austese_repository.git"

projects[austese_collation][type] = "module"
projects[austese_collation][download][type] = "git"
projects[austese_collation][download][url] = "https://github.com/uq-eresearch/austese_collation.git"

;projects[austese_alignment][type] = "module"
;projects[austese_alignment][download][type] = "git"
;projects[austese_alignment]][download][url] = "https://github.com/uq-eresearch/austese_alignment.git"

projects[austese_annotations][type] = "module"
projects[austese_annotations][download][type] = "git"
projects[austese_annotations][download][url] = "https://github.com/uq-eresearch/austese_annotations.git"

  

; Themes
; --------
projects[austese][type] = "theme"
projects[austese][download][type] = "git"
projects[austese][download][url] = "https://github.com/uq-eresearch/austese_theme.git"

  
  
; Libraries
; ---------
libraries[bootstrap][download][type] = "file"
libraries[bootstrap][download][url] = "http://twitter.github.com/bootstrap/assets/bootstrap.zip"
libraries[bootstrap][destination] = "themes/austese"
libraries[bootstrap][folder_name] = "bootstrap"

;"https://api.github.com/repos/twitter/bootstrap/zipball/v2.3.1"


libraries[jquery][download][type] = "file"
libraries[jquery][download][url] = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"

