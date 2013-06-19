module MakeURL
  def self.make_url(url, params={})
    url + '?' + params.keys.zip(params.values).map do |k, v| 
      Rack::Utils.escape(k) + '=' + Rack::Utils.escape(v)
    end.join('&')
  end
end
