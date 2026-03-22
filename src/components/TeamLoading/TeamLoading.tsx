import styles from "./TeamLoading.module.scss";

export type LoadingVariant =
  | "particle"
  | "condensedMatter"
  | "astrophysics"
  | "computationalMath"
  | "biophysics"
  | "experimental";

type TeamLoadingProps = {
  teamName: string;
  variant: LoadingVariant;
  className?: string;
};

export default function TeamLoading({ teamName, variant, className = "" }: TeamLoadingProps) {
  const backgroundClassMap: Record<LoadingVariant, string> = {
    particle: styles.bgParticle,
    condensedMatter: styles.bgCondensedMatter,
    astrophysics: styles.bgAstrophysics,
    computationalMath: styles.bgComputationalMath,
    biophysics: styles.bgBiophysics,
    experimental: styles.bgExperimental,
  };

  return (
    <main className={[styles.page, backgroundClassMap[variant], className].join(" ").trim()}>
      <p className={styles.srOnly}>{teamName}を読み込み中</p>
      <div className={styles.stage}>
        {variant === "particle" && (
            <div className={styles.stringRope}>
              <svg
                className={styles.ropeSvg}
                viewBox="0 0 220 64"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  className={styles.ropePath}
                  d="M10,24 C35,18 60,46 85,32 C110,18 135,46 160,32 C180,20 198,44 210,24"
                >
                  <animate
                    attributeName="d"
                    dur="1.15s"
                    repeatCount="indefinite"
                    values="
                      M10,24 C35,18 60,46 85,32 C110,18 135,46 160,32 C180,20 198,44 210,24;
                      M10,40 C35,46 60,18 85,32 C110,46 135,18 160,32 C180,44 198,20 210,40;
                      M10,24 C35,18 60,46 85,32 C110,18 135,46 160,32 C180,20 198,44 210,24
                    "
                  />
                </path>
              </svg>
          </div>
        )}

        {variant === "condensedMatter" && (
          <div className={styles.spinChain}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}

        {variant === "astrophysics" && (
          <div className={styles.astroSystem}>
            <span className={styles.orbitOne} />
            <span className={styles.orbitTwo} />
            <span className={styles.orbitThree} />
            <span className={styles.core} />
          </div>
        )}

        {variant === "computationalMath" && (
          <div className={styles.perceptron}>
            <div className={styles.layer}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.layer}>
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.layer}>
              <span />
              <span />
            </div>
          </div>
        )}

        {variant === "biophysics" && (
          <div className={styles.brownianBox}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}

        {variant === "experimental" && (
          <div className={styles.pendulum}>
            <span className={styles.pendulumRod} />
            <span className={styles.pendulumBob} />
          </div>
        )}
      </div>
    </main>
  );
}
