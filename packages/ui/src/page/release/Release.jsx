import About from "../../components/release/About";
import ChangeLog from "../../components/release/ChangeLog";
function Release() {
  return (
    <section
      className="container"
      style={{ marginTop: "1rem", marginBottom: "3rem" }}
    >
      {/* About section  */}
      <About />

      {/* changelog */}
      <ChangeLog />
    </section>
  );
}

export default Release;
