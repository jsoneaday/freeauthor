import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { kwilApi } from "../common/api/KwilApiInstance";
import { PrimaryButton } from "../common/components/Buttons";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { MarkdownEditor } from "../common/components/MarkdownEditor";
import { ValidationAndProgressMsg } from "../common/components/ValidationAndProgressMsg";

enum WriteValidation {
  TitleTooLong = "Title must be less than 100 characters",
  TitleBlank = "Title cannot be blank",
  DescTooLong = "Description must be less than 250 characters",
  FieldIsValid = "",
}

const START_CONTENT_SUBMIT_MSG = "Please wait while your story is submitted";

export function Write() {
  const mdRef = useRef<MDXEditorMethods>(null);
  const [profile, _setProfile] = useProfile();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true);

  const submitValue = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!profile || profile?.id === 0)
      throw new Error("First register a profile and connect");

    if (!validateAllFields()) return;

    const tx = await kwilApi.addWork(
      title,
      description,
      mdRef.current?.getMarkdown() || "",
      profile.id
    );
    await kwilApi.waitAndGetId(tx);

    setValidationMsg(
      "Story submitted successfully. You can continue editing it here or browse other stories."
    );
  };

  const validateTitle = (title: string) => {
    if (title.length > 100) return WriteValidation.TitleTooLong;
    if (!title) return WriteValidation.TitleBlank;
    return WriteValidation.FieldIsValid;
  };

  const validateDesc = (desc: string) => {
    if (desc.length > 100) return WriteValidation.DescTooLong;
    return WriteValidation.FieldIsValid;
  };

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const validationMsg = validateTitle(e.target.value);
    setIsSubmitBtnDisabled(
      validationMsg === WriteValidation.FieldIsValid ? false : true
    );
    setTitle(e.target.value);
    setValidationMsg(validationMsg);
  };

  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    const validationMsg = validateDesc(e.target.value);
    setIsSubmitBtnDisabled(
      validationMsg === WriteValidation.FieldIsValid ? false : true
    );
    setDescription(e.target.value);
    setValidationMsg(validationMsg);
  };

  const validateAllFields = (): boolean => {
    const titleValidation = validateTitle(title);
    const descValidation = validateDesc(description);

    if (titleValidation !== WriteValidation.FieldIsValid) {
      setValidationMsg(titleValidation);
      return false;
    } else if (descValidation !== WriteValidation.FieldIsValid) {
      setValidationMsg(descValidation);
      return false;
    }
    setValidationMsg("");
    return true;
  };

  return (
    <div className="home-content" style={{ marginTop: "1.75em" }}>
      <section className="profile-form-section" style={{ marginBottom: "3em" }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className="profile-form-item"
          value={title}
          onChange={onChangeTitle}
        />
      </section>
      <section
        className="profile-form-section"
        style={{ marginBottom: "4.5em" }}
      >
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          className="profile-form-item"
          value={description}
          onChange={onChangeDescription}
        />
      </section>
      <section
        className="profile-form-section"
        style={{ marginBottom: "4.5em" }}
      >
        <label>Story</label>
        <MarkdownEditor mdRef={mdRef} readOnly={false} />
      </section>
      <div className="btn-span-align">
        <span style={{ marginRight: "2em" }}>
          <ValidationAndProgressMsg
            validationMsg={validationMsg}
            progressStartMsg={START_CONTENT_SUBMIT_MSG}
          />
        </span>
        <PrimaryButton
          label="Submit"
          onClick={submitValue}
          style={{ width: "80px" }}
          isDisabled={isSubmitBtnDisabled}
        />
      </div>
    </div>
  );
}
