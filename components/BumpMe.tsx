import SectionLabel from "./SectionLabel";
import Handshake from "./Handshake";

export default function BumpMe() {
  return (
    <section
      id="bump"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionLabel>Bump Me</SectionLabel>

        <div className="mt-8">
          <Handshake />
        </div>
      </div>
    </section>
  );
}
