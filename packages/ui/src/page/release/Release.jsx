import About from "../../components/release/ReleaseAbout";
import ChangeLog from "../../components/release/ChangeLog";
function Release() {
  return (
    <section
      className="container"
      style={{ marginTop: "2rem", marginBottom: "3rem" }}
    >
      <About />
      <ChangeLog />
    </section>
  );
}

export default Release;
