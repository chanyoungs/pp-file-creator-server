# PP File Creator (PFC.. to be renamed)

> ### a sermon creator
> ### for the technically challenged


## The Idea
1. Media director will upload the churches custom ProPresenter template.
2. PFC will connect with planning center and create a placeholder for the Sundays sermon.
3. Pastors will then log in to PFC during the week and create their presentation.
4. Media team will Download the presentation on Sunday and open the generated file in pro presenter.

## Pages
- Home page
  - Summary?
- Presentations
  - View presentations
  - create a presentation
  - print slides
- Templates
  - upload templates
  - view uploaded templates
- Admin
  - Users
  - Permissions
  - Integrations
  - Payment

### Home Page
The home page should contain a summary of the month ahead, similar to planning centre.

### Presentations
The presentations page will be where most of the work will be spent. It should include an WYSIWYG editor, a live preview and provisions to create new slides, delete slides and reorder the slides.

There should also be an easy way to add verses, verses will be fetched using a third party bible api.

There should be an easy way to add images, images should be checked to ensure they are of high quality and in a compatible format. 

Presentations should be stored in such a way that the chosen template is selected by default, however the slide should be able to be downloaded in a different format from the chosen template.

A listings of the slide should be able to be printed, as well as downloaded in common formats (eg PDF, DOCX).

### Templates
ProPresenter 5 and ProPresenter 6 templates should be supported. Each template from the template bundle should be presented individually. 

The template page should show a preview of the template with text so that each template style is clearly visible, if a template does not already include text it should be added in. The title of the template, as well as the purpose of the template should be clearly outlined.

Templates should be able to be sorted, deleted and placed into folders.

A default template should be made available.

### Settings
The settings page should be visible to only those with permissions.

It should include all miscellaneous settings.

## Integrations
The app should be able to download run sheets from third party software to ensure that it is easy to use for operators.
- Planning Center
- Elvanto

## Access Levels
- (Create / Edit / Delete / View) Users
- (Create / Edit / Delete / View) Templates
- (Create / Edit / Delete / View) Sermons

#### Example Access Levels
1. Media Director
    1. ALL Users
    2. ALL Templates
    3. ALL Sermons
1. Pastor
    1. View Templates
    2. Create / Edit / Delete / View THEIR sermons
1. Sunday Morning Guy
    1. View All Sermons


## Payment
The app will be available on a monthly or yearly subscription. 

It should support common payment gateways.

