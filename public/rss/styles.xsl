<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 20px
            padding: 15px;
          }
          a, a:link, a:visited {
            color: #087c78;
            text-decoration: underline;
          }
          a:hover {
            color: #a53719;
            text-decoration: none;
          }
          .alert {
            color: #666;
            font-size: 11px;
            margin-bottom: 20px;
            text-align: center;
          }
          .container {
            max-width: 850px;
            margin: 0 auto;
            background: #fff;
            border-radius: 4px;
            padding: 15px;
          }
          .podcast-container {
            background: #FAFAFA;
            border: 1px solid #EAEAEA;
            border-radius: 5px;
            display: flex;
            padding: 15px;
          }
          .podcast-image {
            margin-right: 30px;
            width: 150px;
          }
          .podcast-image img {
            width: 150px;
            height: auto;
            border-radius: 5px;
          }
          .podcast-title {
            color: #222;
            font-size: 25px;
            line-height: 30px;
            margin: 10px 0 0 0;
          }
          .podcast-description {
            line-height: 19px;
            margin-top: 10px;
          }
          .item {
            clear: both;
            border-bottom: 1px solid #EAEAEA;
            padding: 30px 0;
          }
          .episode-title {
            color: #222;
            font-size: 20px;
            line-height: 25px;
            margin: 0 0 5px 0;
          }
          .episode-meta {
            font-size: 11px;
            color: #666;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .episode-description {
            line-height: 19px;
            margin-bottom: 30px;
          }
          .episode-image img {
            width: 100px;
            height: auto;
            margin: 0 30px 15px 0;
            border-radius: 5px;
          }
          audio {
            width: 100%;
            border-radius: 5px;
          }
          audio:focus {
            outline: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert">
            Щоб підписатися на цей подкаст, скопіюйте та вставте URL-адресу з адресного рядка в обрану вами програму для подкастів.
          </div>
          <div class="podcast-container">
            <xsl:if test="/rss/channel/image">
              <div class="podcast-image">
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="/rss/channel/image/link"/>
                  </xsl:attribute>
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="/rss/channel/image/url"/>
                    </xsl:attribute>
                    <xsl:attribute name="title">
                      <xsl:value-of select="/rss/channel/image/title"/>
                    </xsl:attribute>
                  </img>
                </a>
              </div>
            </xsl:if>
            <div>
              <h1 class="podcast-title">
                <xsl:value-of select="/rss/channel/title"/>
              </h1>
              <div class="podcast-description">
                <xsl:value-of select="/rss/channel/description" disable-output-escaping="yes"/>
              </div>
            </div>
          </div>
          <xsl:for-each select="/rss/channel/item">
            <xsl:variable name="itemURL">
              <xsl:value-of select="link" />
            </xsl:variable>
            <div class="item">
              <h2 class="episode-title">
                <a href="{$itemURL}">
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <div class="episode-meta">
                <span><xsl:value-of select="pubDate" /></span> &#9702;
                <span><xsl:value-of select="format-number(floor(itunes:duration div 60), '0')" /> хвилин</span>
              </div>
              <xsl:if test="description">
                <div class="episode-description">
                  <xsl:value-of select="description" disable-output-escaping="yes"/>
                </div>
              </xsl:if>
              <audio controls="true" preload="none">
                <xsl:attribute name="src">
                  <xsl:value-of select="enclosure/@url"/>
                </xsl:attribute>
              </audio>
            </div>
          </xsl:for-each>
        </div>

        <script>
          <![CDATA[
          setTimeout(() => {
            const descriptions = Array.from(
              document.querySelectorAll('.episode-description')
            );

            descriptions.forEach((div) => {
              const isRawText = div.children.length === 0 &&
                div.textContent.includes('<');

              if (isRawText) {
                div.innerHTML = div.textContent;
              }
            });
          }, 0);
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
