import { ChangeEvent, useState, MouseEvent } from "react";
import { kwilApi } from "../api/KwilApiInstance";
import { useProfile } from "../zustand/Store";
import { PrimaryButton } from "./Buttons";
import { ValidationAndProgressMsg } from "./ValidationAndProgressMsg";

enum InputValidationState {
  UsernameTooLong = "Username cannot be greater than 50 characters",
  UsernameHasNoValue = "Username must have a value",
  FullnameTooLong = "Fullname cannot be greater than 100 characters",
  FullnameHasNoValue = "Fullname must have a value",
  DescriptionTooLong = "Description cannot be greater than 250 characters",
  PrimarySocialTooLong = "Primary social link cannot be greater than 250 characters",
  SecondarySocialTooLong = "Primary social link cannot be greater than 250 characters",
  FieldIsValid = "",
}

const START_CREATE_PROFILE_MSG = "Please wait while your profile is created";

export interface ProfileFormProps {
  profileCreatedCallback: () => void;
}

export function ProfileForm({ profileCreatedCallback }: ProfileFormProps) {
  const [validationMsg, setValidationMsg] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [description, setDescription] = useState("");
  const [socialPrimary, setSocialPrimary] = useState("");
  const [socialSecondary, setSocialSecondary] = useState("");
  const setProfile = useProfile((state) => state.setProfile);
  const [createProfileBtnDisabled, setCreateProfileBtnDisabled] =
    useState(true);

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const validation = validateUsername(e.target.value);

    setCreateProfileBtnDisabled(
      validation === InputValidationState.FieldIsValid ? false : true
    );

    setUsername(e.target.value);
    setValidationMsg(validation);
  };
  const onChangeFullname = (e: ChangeEvent<HTMLInputElement>) => {
    const validation = validateFullname(e.target.value);

    setCreateProfileBtnDisabled(
      validation === InputValidationState.FieldIsValid ? false : true
    );

    setFullname(e.target.value);
    setValidationMsg(validation);
  };
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    const validation = validateDescription(e.target.value);

    setCreateProfileBtnDisabled(
      validation === InputValidationState.FieldIsValid ? false : true
    );

    setDescription(e.target.value);
    setValidationMsg(validation);
  };
  const onChangeSocialPrimary = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateProfileBtnDisabled(true);
    if (e.target.value.length > 250) {
      setValidationMsg(
        "Primary social link cannot be greater than 250 characters"
      );
    } else {
      setSocialPrimary(e.target.value.trim());
      setCreateProfileBtnDisabled(false);
    }
  };
  const onChangeSocialSecondary = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateProfileBtnDisabled(true);
    if (e.target.value.length > 250) {
      setValidationMsg(
        "Secondary social link cannot be greater than 250 characters"
      );
    } else {
      setSocialSecondary(e.target.value.trim());
      setCreateProfileBtnDisabled(false);
    }
  };

  const validateUsername = (strInput: string): InputValidationState => {
    if (strInput.length > 50) {
      return InputValidationState.UsernameTooLong;
    } else if (!strInput) {
      return InputValidationState.UsernameHasNoValue;
    } else {
      return InputValidationState.FieldIsValid;
    }
  };
  const validateFullname = (strInput: string): InputValidationState => {
    if (strInput.length > 100) {
      return InputValidationState.FullnameTooLong;
    } else if (!strInput) {
      return InputValidationState.FullnameHasNoValue;
    } else {
      return InputValidationState.FieldIsValid;
    }
  };
  const validateDescription = (strInput: string): InputValidationState => {
    if (strInput.length > 100) {
      return InputValidationState.DescriptionTooLong;
    } else {
      return InputValidationState.FieldIsValid;
    }
  };
  const validatePrimarySocial = (strInput: string): InputValidationState => {
    if (strInput.length > 100) {
      return InputValidationState.PrimarySocialTooLong;
    } else {
      return InputValidationState.FieldIsValid;
    }
  };
  const validateSecondarySocial = (strInput: string): InputValidationState => {
    if (strInput.length > 100) {
      return InputValidationState.SecondarySocialTooLong;
    } else {
      return InputValidationState.FieldIsValid;
    }
  };

  const validateAllFields = (): boolean => {
    const usernameValidation = validateUsername(username);
    const fullnameValidation = validateFullname(fullname);
    const descValidation = validateDescription(description);
    const socialPrimaryValidation = validatePrimarySocial(socialPrimary);
    const socialSecondaryValidation = validateSecondarySocial(socialSecondary);
    console.log(
      "validations:",
      usernameValidation,
      fullnameValidation,
      descValidation,
      socialPrimaryValidation,
      socialSecondaryValidation
    );
    if (usernameValidation !== InputValidationState.FieldIsValid) {
      setValidationMsg(usernameValidation);
      return false;
    } else if (fullnameValidation !== InputValidationState.FieldIsValid) {
      setValidationMsg(fullnameValidation);
      return false;
    } else if (descValidation !== InputValidationState.FieldIsValid) {
      setValidationMsg(descValidation);
      return false;
    } else if (socialPrimaryValidation !== InputValidationState.FieldIsValid) {
      setValidationMsg(socialPrimaryValidation);
      return false;
    } else if (
      socialSecondaryValidation !== InputValidationState.FieldIsValid
    ) {
      setValidationMsg(socialSecondaryValidation);
      return false;
    } else {
      setValidationMsg("");
      return true;
    }
  };

  const createProfile = async (e: MouseEvent<HTMLButtonElement>) => {
    console.log("enter createProfile");
    e.preventDefault();

    if (!validateAllFields()) return;

    setValidationMsg(START_CREATE_PROFILE_MSG);
    await kwilApi.addProfile(
      username,
      fullname,
      description,
      kwilApi.Address,
      socialPrimary,
      socialSecondary
    );

    const profile = await kwilApi.getOwnersProfile();
    if (!profile) throw new Error("Profile has not been created!");

    setProfile({
      id: profile.id,
      updatedAt: profile.updated_at,
      username: profile.username,
      fullname: profile.fullname,
      description: profile.description,
      ownerAddress: profile.owner_address,
      socialLinkPrimary: profile.social_link_primary,
      socialLinkSecond: profile.social_link_second,
    });
    profileCreatedCallback();
    setValidationMsg("");
  };

  return (
    <form className="profile-form-container">
      <section className="profile-form-section">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="profile-form-item"
          value={username}
          onChange={onChangeUsername}
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="fullname">Fullname</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          className="profile-form-item"
          value={fullname}
          onChange={onChangeFullname}
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          className="profile-form-item"
          value={description}
          onChange={onChangeDescription}
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="social-link-primary">Primary Social</label>
        <input
          type="text"
          id="social-link-primary"
          name="social-link-primary"
          className="profile-form-item"
          value={socialPrimary}
          onChange={onChangeSocialPrimary}
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="social-link-secondary">Secondary Social</label>
        <input
          type="text"
          id="social-link-secondary"
          name="social-link-secondary"
          className="profile-form-item"
          value={socialSecondary}
          onChange={onChangeSocialSecondary}
        ></input>
      </section>
      <section className="btn-span-align" style={{ marginBottom: "0.75em" }}>
        <span
          style={{ marginTop: "0.75em", display: "flex", alignItems: "center" }}
        >
          <ValidationAndProgressMsg
            validationMsg={validationMsg}
            progressStartMsg={START_CREATE_PROFILE_MSG}
          />
        </span>

        <PrimaryButton
          label="Create"
          isDisabled={createProfileBtnDisabled}
          style={{
            marginTop: "1em",
            color: createProfileBtnDisabled
              ? "var(--tertiary-cl)"
              : "var(--primary-cl)",
          }}
          onClick={createProfile}
        />
      </section>
    </form>
  );
}
