import { ChangeEvent, useState, MouseEvent } from "react";
import { kwilApi } from "../api/KwilApi";
import { useProfile } from "../redux/profile/ProfileHooks";

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
  const [_profile, setProfile] = useProfile();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 50) {
      setValidationMsg("Username cannot be greater than 50 characters");
    } else if (!e.target.value) {
      setValidationMsg("Username must have a value");
    } else {
      setUsername(e.target.value.replace(/^@/, ""));
    }
  };
  const onChangeFullname = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 100) {
      setValidationMsg("Fullname cannot be greater than 100 characters");
    } else if (!e.target.value) {
      setValidationMsg("Fullname must have a value");
    } else {
      setFullname(e.target.value);
    }
  };
  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 250) {
      setValidationMsg("Description cannot be greater than 250 characters");
    } else if (!e.target.value) {
      setValidationMsg("Description must have a value");
    } else {
      setDescription(e.target.value);
    }
  };
  const onChangeSocialPrimary = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 250) {
      setValidationMsg(
        "Primary social link cannot be greater than 250 characters"
      );
    } else {
      setSocialPrimary(e.target.value);
    }
  };
  const onChangeSocialSecondary = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 250) {
      setValidationMsg(
        "Secondary social link cannot be greater than 250 characters"
      );
    } else {
      setSocialSecondary(e.target.value);
    }
  };

  const createProfile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const tx = await kwilApi.addProfile(
      username,
      fullname,
      description,
      socialPrimary,
      socialSecondary
    );

    await kwilApi.waitAndGetId(tx);
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
  };

  return (
    <div className="profile-form-container">
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
      <section className="profile-form-btn">
        <span>{validationMsg}</span>
        <button
          className="primary-btn"
          style={{ marginTop: "1em" }}
          onClick={createProfile}
        >
          Create
        </button>
      </section>
    </div>
  );
}
