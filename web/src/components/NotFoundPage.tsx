import "./NotFoundPage.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="notfound-container">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Text */}
      <div className="text">
        <div>ERROR</div>
        <h1>404</h1>
        <hr />
        <div className="mb-4">Page Not Found</div>

        {/* Dashboard Button */}
        <Button
          variant="default"
          className="cursor-pointer border border-border"
          onClick={() => navigate({ to: "/" })}
        >
          Go to Dashboard
        </Button>
      </div>

      {/* Astronaut */}
      <div className="astronaut">
        <img
          src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png"
          alt="astronaut"
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
