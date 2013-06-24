require "addressable/uri"

module ApplicationHelper

	#Use when calling #link_icon with :mail_to as the :link_type
	def mail_to_block(url, options, &block)
		mail_to url, capture(&block), options
	end

	#Takes url, icon & optional class for link
	def link_icon(options)
		opts = {
			:url => "#",
			:link_type => :link_to
		}.merge(options)
		link_params = opts.except(:url, :icon, :link_type)

		send opts[:link_type], opts[:url], link_params do
			"<i class='icon-#{opts[:icon]}'></i>".html_safe
		end
	end

	def current_page_url
		"#{request.protocol}#{request.host_with_port}#{request.fullpath}"
	end

	def twitter_share_url(opts)
		uri = Addressable::URI.new
		uri.query_values = opts
		"https://twitter.com/share?" + uri.query
	end

	def tagline
		"Discover new music by voting on split-second snippets."
	end

end
