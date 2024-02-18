export function Register() {
  return (
    <form>
      <section>
        <label htmlFor="username"></label>
        <input id="username" type="text" />
      </section>
      <section>
        <label htmlFor="fullName"></label>
        <input id="fullName" type="text" />
      </section>
      <section>
        <label htmlFor="description"></label>
        <input id="description" type="text" />
      </section>
    </form>
  );
}
