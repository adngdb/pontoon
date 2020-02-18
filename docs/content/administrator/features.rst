Pontoon's Features
==================

Pontoon is a translation management system used and developed by the Mozilla
localization community. It can handle any project that uses one of the
supported file formats:

+-------+---------------+-------------+--------+-----------------------+
| .dtd  | .ftl (Fluent) | .inc        | .ini   | .json (WebExtensions) |
+-------+---------------+-------------+--------+-----------------------+
| .lang | .po (Gettext) | .properties | .xliff | .xml (Android)        |
+-------+---------------+-------------+--------+-----------------------+

Pontoon can pull strings it needs to translate from an external source, and write
them back periodically. Typically these external sources are version control
repositories that store the strings for an application. Supported external
sources include **Git**, **Mercurial** and **Subversion**.
