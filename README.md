# PFC - Pro Presenter File Creator (Server)
This is the Server repo, find the client [here](https://github.com/kevindoveton/pp-file-creator)

PFC is a more friendly file editor for pro presenter, whilst the built in pro presenter editor is perfectly fine for those
with experience it requires having the software installed, as well as having to learn the usage of a new program. It also
does not easily allow slide templates to be changed without having to reformat all presentations.

PFC allows those with no experience to create beautiful presentations based on predefined templates uploaded. It also allows 
presentations to worked on remotely, from any device. Upon completing the presentation its saved in the cloud, allowing it 
to be downloaded at a later date. PFC also features facebook sign up to enable easier logins.

## Technical challenges faced
  - Reverse engineering the pro presenter file protocol
  - Reverse engineering the pro presenter template protocol
  - Generating an accurate real time render of the template using web technologies
  - Efficiently storing templates / files, enabling fast download but also enabling the file to be updated
