class ApplicationController < ActionController::Base
  protect_from_forgery

  def current_user
    return nil if session[:token].nil?
  	@current_user ||= User.find_by_token(session[:token])
  end

  def ensure_token
  	if current_user.nil?
  		@current_user = User.create
  		session[:token] = @current_user.token
  	end
  end

end
