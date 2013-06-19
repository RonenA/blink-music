class VotesController < ApplicationController
	before_filter :ensure_token

	def judge
	end

	#Array of soundcloud track id's current_user should vote on
	def candidates
		render :json => current_user.tracks_to_vote
	end

	def submit
		@vote = Vote.where(:user_id => current_user.id,
							 				 :soundcloud_track_id => params[:soundcloud_track_id]).first

		if @vote.update_attribute(:liked, params[:liked])
			render :json => {}
		else
			render :json => @vote.errors.messages,
						 :status => :unprocessable_entity
		end
	end

	#TODO: Remove
	def kill_cookie
		session[:token] = nil
		redirect_to "/"
	end
end
