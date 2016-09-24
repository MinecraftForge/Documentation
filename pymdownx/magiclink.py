"""
Magic Link.

pymdownx.magiclink
An extension for Python Markdown.
Find http|ftp links and email address and turn them to actual links

MIT license.

Copyright (c) 2014 - 2015 Isaac Muse <isaacmuse@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
"""
from __future__ import unicode_literals
from markdown import Extension
from markdown.inlinepatterns import LinkPattern
from markdown import util

# Maybe in the future add support for unicoderanges: \u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF
RE_MAIL = r'''(?x)(?i)
(
    (?<![/-_@\w])(?:[\-+\w]([\w\-+]|\.(?!\.))*) # Local part
    (?<!\.)@(?:[\w\-]+\.)                       # @domain part start
    (?:(?:[\w\-]|(?<!\.)\.(?!\.))*)[a-z]\b      # @domain.end (allow multiple dot names)
    (?![\d\-_@])                                # Don't allow last char to be followed by these
)
'''

RE_LINK = r'''(?x)(?i)
(
    \b(?:
        (?:ht|f)tps?://(?:(?:[a-z\d][a-z\d\-_]*(?:\.[a-z\d\-._]+)+)|localhost)| # (http|ftp)://
        (?P<www>w{3}\.)[a-z\d][a-z\d\-_]*(?:\.[a-z\d\-._]+)+                    # www.
    )
    /?[a-z\d\-._?,!'(){}\[\]/+&@%$#=:"|~;]*                                     # url path, fragments, and query stuff
    [a-z\d\-_~/#@$*+=]                                                          # allowed end chars
)
'''


class MagiclinkPattern(LinkPattern):
    """Convert html, ftp links to clickable links."""

    def handleMatch(self, m):
        """Handle URL matches."""

        el = util.etree.Element("a")
        el.text = m.group(2)
        if m.group("www"):
            href = "http://%s" % m.group(2)
        else:
            href = m.group(2)
            if self.config['hide_protocol']:
                el.text = el.text[el.text.find("://") + 3:]

        el.set("href", self.sanitize_url(self.unescape(href.strip())))

        return el


class MagicMailPattern(LinkPattern):
    """Convert emails to clickable email links."""

    def handleMatch(self, m):
        """Handle email link patterns."""

        el = util.etree.Element("a")
        href = "mailto:%s" % m.group(2)
        el.text = m.group(2)
        el.set("href", self.sanitize_url(self.unescape(href.strip())))

        return el


class MagiclinkExtension(Extension):
    """Add Easylink extension to Markdown class."""

    def __init__(self, *args, **kwargs):
        """Initialize."""

        self.config = {
            'hide_protocol': [
                False,
                "If 'True', links are displayed without the initial ftp://, http:// or https://"
                "- Default: False"
            ]
        }
        super(MagiclinkExtension, self).__init__(*args, **kwargs)

    def extendMarkdown(self, md, md_globals):
        """Add support for turning html links and emails to link tags."""

        link_pattern = MagiclinkPattern(RE_LINK, md)
        link_pattern.config = self.getConfigs()
        md.inlinePatterns.add("magic-link", link_pattern, "<not_strong")
        md.inlinePatterns.add("magic-mail", MagicMailPattern(RE_MAIL, md), "<not_strong")


def makeExtension(*args, **kwargs):
    """Return extension."""

    return MagiclinkExtension(*args, **kwargs)
