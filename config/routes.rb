BlinkMusic::Application.routes.draw do
 	root :to => 'votes#blast'
 	get '/votes/candidates' => 'votes#candidates'
 	put '/votes/:track_id' => 'votes#submit'

 	#TODO: remove
  get '/logout' => "votes#kill_cookie"

  get '/:share_token' => 'votes#results', :as => :results
end
