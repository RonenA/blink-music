class VotesController < ApplicationController
	before_filter :ensure_token

	def blast
    @tracks = current_user.tracks_to_vote
	end

	#Array of track id's current_user should vote on
	def candidates
		render :json => current_user.tracks_to_vote
	end

	def submit
		@vote = Vote.find_or_create_by_user_id_and_track_id(current_user.id, params[:track_id])

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
      @ballots = @user.like_votes.page(params[:page])
      @tracks = @ballots.map(&:track)

      if @user != current_user
      	@current_user_likes = current_user.liked_tracks
      end

      if params[:page] != nil
        render 'more_results', :layout => false
      end
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
