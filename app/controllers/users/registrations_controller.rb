# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  def new
    @user=User.new
  end

  def create
    @user = User.new(user_params)
    unless @user.valid?
      render :new and return
    end
    session["devise.regist_data"] = {user: @user.attributes}
    session["devise.regist_data"][:user]["password"] = params[:user][:password]
    @address = @user.build_address

    render :new2
  end

  def new3
    @user = User.new(session["devise.regist_data"]["user"])
    @address = Address.new(address_params)
    unless @address.valid?
      flash.now[:alert] = @address.errors.full_messages
      render :new2 and return
    end
  
    @user.build_address(@address.attributes)
    @user.save
    session["devise.regist_data"]["user"].clear
    sign_in(:user, @user)
  end


  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
  protected

  def address_params
    params.require(:address).permit(:sending_first_name, :sending_last_name, :sending_first_name_kana, :sending_last_name_kana, :postal_code, :prefecture_id, :city, :town, :building, :phone)
  end
  def user_params
    params.require(:user).permit(:nickname, :email, :password, :password_confirmation, :first_name, :last_name, :first_name_kana, :last_name_kana,:image, :birthday)
  end
end
