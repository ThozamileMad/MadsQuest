import NavigationBar from "./NavigationBar";
import HeaderDescription from "../common/HeaderDescription";
import Card from "../common/Card";
import { useNavigate } from "react-router-dom";

function HomeApp() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="particles" id="particles"></div>

      <div className="container-main">
        <NavigationBar />

        <HeaderDescription
          containerClassName="hero"
          title="Choose Your Destiny"
          description="Embark on an epic journey where every decision shapes your fate. Create your legend in a world of infinite possibilities."
        />

        <section className="features" id="features">
          <Card
            icon="⚡"
            title="Dynamic Choices"
            description="Each decision ripples through your story, creating unique branching narratives that reflect your choices."
            containerClassName="feature-card"
            iconClassName="feature-icon"
          />

          <Card
            icon="📊"
            title="Character Stats"
            description="Build and evolve your character with a complex stat system that influences your abilities and outcomes."
            containerClassName="feature-card"
            iconClassName="feature-icon"
          />

          <Card
            icon="🌍"
            title="Immersive World"
            description="Explore richly detailed worlds filled with mysteries, dangers, and unforgettable encounters."
            containerClassName="feature-card"
            iconClassName="feature-icon"
          />

          <Card
            icon="🏆"
            title="Multiple Endings"
            description="Discover dozens of unique endings based on your actions, choices, and moral compass throughout the game."
            containerClassName="feature-card"
            iconClassName="feature-icon"
          />
        </section>

        <section className="cta-section">
          <button
            className="cta-button"
            onClick={() =>
              navigate("/play", { state: { sceneID: 25, userID: 1 } })
            }
          >
            Start Your Adventure
          </button>
        </section>

        <footer>
          <p>
            &copy; 2025 Nexus Chronicles. All rights reserved. | Made with ⚡
            and imagination
          </p>
        </footer>
      </div>
    </div>
  );
}

export default HomeApp;
