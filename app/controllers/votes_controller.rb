class VotesController < ApplicationController
	before_filter :ensure_token

	def blast
    @user = current_user
    @tracks = @user.tracks_to_vote
	end

	#Array of track id's current_user should vote on
	def candidates
		render :json => current_user.tracks_to_vote
	end

	def submit
    # TODO: Find it by vote id, though confirming user_id for security.
		@vote = Vote.where(:user_id => current_user.id,
                       :track_id => params[:track_id]).first

		if @vote.update_attribute(:liked, params[:liked])
			render :json => {}
		else
			render :json => @vote.errors.messages,
						 :status => :unprocessable_entity
		end
	end

  def results
    @user = User.find_by_share_token(params[:share_token])
    if @user
      @tracks = @user.liked_tracks
    else
      redirect_to '/'
    end
  end

	#TODO: Remove
	def kill_cookie
		session[:token] = nil
		redirect_to "/"
	end
end
