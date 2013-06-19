BlinkMusic::Application.routes.draw do
 	root :to => 'votes#judge'
 	get '/votes/candidates' => 'votes#candidates'
 	put '/votes/:track_id' => 'votes#submit'


 	#TODO: remove
  get 'logout' => "votes#kill_cookie"
end
