import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import s from "../../styles/LandingFive.module.css";
import languni from "../../assets/Languni.webp";

export default function LandingFive() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={s.page}>
      {/* ===== HEADER ===== */}
      <header className={`${s.header} ${scrolled ? s.headerScrolled : ""}`}>
        <div className={s.headerInner}>
          <a href="/5" className={s.logo}>
            <img src={languni} alt="Languni" width="124" height="32" />
          </a>
          <nav className={s.nav}>
            <a href="#hero" className={s.navLink}>Home</a>
            <a href="#struggle" className={s.navLink}>Why us</a>
            <a href="#how" className={s.navLink}>How it works</a>
          </nav>
          <div className={s.headerBtns}>
            <button onClick={() => navigate({ to: "/login" })} className={s.logBtn}>
              Log in
            </button>
            <button onClick={() => navigate({ to: "/register" })} className={s.tryBtn}>
              Try it free
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className={s.hero} id="hero">
        {/* Decorative shapes */}
        <div className={s.deco1} />
        <div className={s.deco2} />
        <div className={s.deco3} />

        <div className={s.heroInner}>
          <div className={s.heroBubbles}>
            <span className={s.bubble} style={{ '--d': '0s', '--x': '-60px', '--y': '20px' }}>Hola &#128075;</span>
            <span className={s.bubble} style={{ '--d': '0.8s', '--x': '50px', '--y': '-15px' }}>Bonjour &#127467;&#127479;</span>
            <span className={s.bubble} style={{ '--d': '1.6s', '--x': '-30px', '--y': '40px' }}>Hello &#127468;&#127463;</span>
          </div>

          <h1 className={s.heroH1}>
            YouTube + subtitles
            <br />
            <span className={s.heroScript}>= fluency</span>
          </h1>
          <p className={s.heroP}>
            Pick any YouTube video. We add interactive subtitles. Click a word
            you don't know — boom, instant definition. Save it, review it, own it.
            That's Languni.
          </p>
          <button onClick={() => navigate({ to: "/register" })} className={s.heroBtn}>
            Start learning — free forever
          </button>

          {/* Illustration-style cards */}
          <div className={s.heroCards}>
            <div className={s.hCard} style={{ '--rot': '-4deg', '--delay': '0.2s' }}>
              <div className={s.hCardEmoji}>&#127909;</div>
              <div className={s.hCardText}>Watch real videos</div>
            </div>
            <div className={s.hCard} style={{ '--rot': '2deg', '--delay': '0.4s' }}>
              <div className={s.hCardEmoji}>&#128070;</div>
              <div className={s.hCardText}>Click any word</div>
            </div>
            <div className={s.hCard} style={{ '--rot': '-1deg', '--delay': '0.6s' }}>
              <div className={s.hCardEmoji}>&#128218;</div>
              <div className={s.hCardText}>Build vocabulary</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STRUGGLE — Timeline ===== */}
      <section className={s.struggle} id="struggle">
        <div className={s.sectionInner}>
          <div className={s.badge}>The struggle is real</div>
          <h2 className={s.sectionH2}>
            We've all been there...
          </h2>

          <div className={s.timeline}>
            <div className={s.tlLine} />

            <div className={s.tlItem}>
              <div className={s.tlDot}>&#128553;</div>
              <div className={s.tlCard}>
                <h3>Flashcard fatigue</h3>
                <p>You've swiped through 10,000 cards and still can't hold a conversation. Memorizing without context is a dead end.</p>
              </div>
            </div>

            <div className={`${s.tlItem} ${s.tlRight}`}>
              <div className={s.tlDot}>&#129393;</div>
              <div className={s.tlCard}>
                <h3>Robotic dialogues</h3>
                <p>"Where is the library?" "The library is on the left." — Nobody speaks like this. Textbook content kills motivation.</p>
              </div>
            </div>

            <div className={s.tlItem}>
              <div className={s.tlDot}>&#128565;</div>
              <div className={s.tlCard}>
                <h3>Difficulty whiplash</h3>
                <p>Lesson 1: "Hello." Lesson 2: "Explain the subjunctive tense." There's no gradual progression that respects your level.</p>
              </div>
            </div>

            <div className={`${s.tlItem} ${s.tlRight}`}>
              <div className={s.tlDot}>&#128184;</div>
              <div className={s.tlCard}>
                <h3>Wallet drain</h3>
                <p>Expensive apps, private tutors, textbooks — learning a language shouldn't cost more than a gym membership.</p>
              </div>
            </div>
          </div>

          <div className={s.fixBanner}>
            <span className={s.fixArrow}>&#10549;</span>
            <div>
              <h3>There's a better way.</h3>
              <p>Real YouTube videos. Interactive subtitles. Vocabulary that actually sticks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — Zigzag ===== */}
      <section className={s.how} id="how">
        <div className={s.sectionInner}>
          <div className={s.badge}>How it works</div>
          <h2 className={s.sectionH2}>
            Three steps to fluency
          </h2>

          <div className={s.zigzag}>
            {/* Step 1 */}
            <div className={s.zigRow}>
              <div className={s.zigVisual}>
                <div className={s.zigScreen}>
                  <div className={s.zigThumbRow}>
                    <div className={s.zigThumb} style={{ background: 'var(--terra-light)' }}>
                      <span>&#127926;</span>
                    </div>
                    <div className={s.zigThumb} style={{ background: 'var(--sage-light)' }}>
                      <span>&#127908;</span>
                    </div>
                    <div className={s.zigThumb} style={{ background: 'var(--mustard-light)' }}>
                      <span>&#127916;</span>
                    </div>
                  </div>
                  <div className={s.zigLabel}>Trending in Spain</div>
                </div>
              </div>
              <div className={s.zigText}>
                <span className={s.zigNum}>01</span>
                <h3>Browse trending videos</h3>
                <p>
                  Discover YouTube videos matched to your language and proficiency
                  level. Music, vlogs, news, comedy — whatever keeps you hooked.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`${s.zigRow} ${s.zigRowReverse}`}>
              <div className={s.zigVisual}>
                <div className={s.zigScreen}>
                  <div className={s.zigCaption}>
                    <span>La vida es </span>
                    <span className={s.zigHL}>hermosa</span>
                    <span> cuando aprendes</span>
                  </div>
                  <div className={s.zigPopup}>
                    <strong>hermosa</strong>
                    <em>adj. beautiful, gorgeous</em>
                  </div>
                </div>
              </div>
              <div className={s.zigText}>
                <span className={s.zigNum}>02</span>
                <h3>Click any word to learn</h3>
                <p>
                  As the video plays, click any word in the interactive subtitles.
                  Get instant definitions, pronunciation, translations, and real
                  example sentences.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={s.zigRow}>
              <div className={s.zigVisual}>
                <div className={s.zigScreen}>
                  <div className={s.zigWordCloud}>
                    <span style={{ '--s': '1.2', color: 'var(--terra)' }}>hermosa</span>
                    <span style={{ '--s': '0.9', color: 'var(--sage)' }}>idioma</span>
                    <span style={{ '--s': '1.1', color: 'var(--mustard)' }}>aprender</span>
                    <span style={{ '--s': '0.85', color: 'var(--plum)' }}>vida</span>
                    <span style={{ '--s': '1', color: 'var(--terra)' }}>nuevo</span>
                    <span style={{ '--s': '0.95', color: 'var(--sage)' }}>bonito</span>
                  </div>
                </div>
              </div>
              <div className={s.zigText}>
                <span className={s.zigNum}>03</span>
                <h3>Build your word bank</h3>
                <p>
                  Save every new word with real context from the video. Review
                  your growing vocabulary collection anytime — definitions, examples,
                  and all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===== FOOTER ===== */}
      <footer className={s.footer}>
        <div className={s.footerStripe} />
        <div className={s.footerBody}>
          <div className={s.footerInner}>
            <div className={s.footerBrand}>
              <a href="/5" className={s.footerLogo}>
                <img src={languni} alt="Languni" width="108" height="28" />
              </a>
              <p>Learn languages through real YouTube videos.</p>
            </div>
            <div className={s.footerCol}>
              <h4>Product</h4>
              <a href="#how">Features</a>
              <a href="#">Languages</a>
            </div>
            <div className={s.footerCol}>
              <h4>Company</h4>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
              <a href="#">About</a>
            </div>
            <div className={s.footerCol}>
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
          <div className={s.footerBottom}>
            &copy; 2026 Languni. Made with &#10084;&#65039; for language lovers.
          </div>
        </div>
      </footer>
    </div>
  );
}
