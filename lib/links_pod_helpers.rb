# encoding: utf-8
module LinksPodHelpers

  def current_link_class(path = "/")
    current_page.path == path ? "active" : ""
  end

end