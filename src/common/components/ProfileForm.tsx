export function ProfileForm() {
  return (
    <div className="profile-form-container">
      <section className="profile-form-section">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="profile-form-item"
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="fullname">Fullname</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          className="profile-form-item"
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          className="profile-form-item"
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="social-link-primary">Primary Social</label>
        <input
          type="text"
          id="social-link-primary"
          name="social-link-primary"
          className="profile-form-item"
        ></input>
      </section>
      <section className="profile-form-section">
        <label htmlFor="social-link-secondary">Secondary Social</label>
        <input
          type="text"
          id="social-link-secondary"
          name="social-link-secondary"
          className="profile-form-item"
        ></input>
      </section>
      <section className="profile-form-btn">
        <span></span>
        <button className="primary-btn" style={{ marginTop: "1em" }}>
          Create
        </button>
      </section>
    </div>
  );
}
