import Image from "next/image";
import { profile } from "@/data/profile";
import SectionLabel from "./SectionLabel";
import StatCounter from "./StatCounter";

export default function About() {
  return (
    <section
      id="about"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-[#262626]"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionLabel>About</SectionLabel>

        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20 items-start">
          {/* Bio */}
          <div className="max-w-2xl">
            {profile.bio.map((para, i) => (
              <p
                key={i}
                className={`text-lg sm:text-2xl leading-relaxed ${
                  i === 0 ? "text-[#ededed]" : "mt-6 text-[#b5b5b5]"
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Photo */}
          <div className="order-first lg:order-none">
            <div className="relative h-40 w-40 sm:h-52 sm:w-52 overflow-hidden rounded-2xl border border-[#262626] grayscale">
              <Image
                src={profile.headshot}
                alt={profile.fullName}
                fill
                sizes="208px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Animated stat counters */}
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-[#262626] pt-12">
          {profile.stats.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
