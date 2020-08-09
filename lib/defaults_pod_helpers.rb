# encoding: utf-8
module DefaultPodHelpers

  def default_title_helper
    "RWpod - подкаст про мир Ruby и Web технологии"
  end

  def default_keywords_helper
    "RWpod, Ruby, Web, подкаст, русский подкаст, скринкасты, программирование"
  end

  def default_description_helper
    "RWpod - подкаст про мир Ruby и Web технологии (для тех, кому нравится мыслить в Ruby стиле)."
  end

  def default_long_description_helper
    "RWpod - подкаст про мир Ruby и Web технологии (для тех, кому нравится мыслить в Ruby стиле)."
  end

  def default_main_description_helper
    "Подкаст про мир Ruby и Web технологии (для тех, кому нравится мыслить в Ruby стиле)."
  end

  def full_url(url)
    "#{config[:rwpod_urls_base] || ''}#{url_for(url)}"
  end

  def default_itune_url
    'https://itunes.apple.com/ru/podcast/rwpod-podkast-pro-mir-ruby/id597248066'
  end

  def default_image_helper
    full_url('/images/logo200.png')
  end

  def default_big_image_helper
    full_url('/images/logo.png')
  end

  def default_footer_copyright_helper
    "Copyright RWpod."
  end

  def default_author_helper
    "RWpod команда"
  end

  def default_email_helper
    "rwpod.com@gmail.com"
  end

  def truncated_article_title(article)
    article.title.truncate(21, separator: /\s/, omission: '')
  end

  def article_date(article)
    article.date.strftime('%d.%m.%Y')
  end

  def article_short_date(article)
    article.date.strftime('%Y-%m-%d')
  end

end
