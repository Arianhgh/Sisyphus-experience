import { useEffect, useRef } from 'react';
import { Engine, Render, Bodies, World, Runner } from 'matter-js';
import { Body } from 'matter-js';
import { useState } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const scene = useRef();
  const engine = useRef();
  const ball = useRef();
  const ramp = useRef();
  const [movespeed, setMovespeed] = useState(0.22);
  const [showScript, setShowScript] = useState(false)
  const [currentScriptIndex, setCurrentScriptIndex] = useState(-1);
  const [currentspeed, setCurrentspeed] = useState(0.22);
  const [isSpaceBarPressed, setIsSpaceBarPressed] = useState(false);
  const [hasReachedPosition, setHasReachedPosition] = useState(false);
  
  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    //get the width and height of div with class app
    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;

    engine.current = Engine.create();

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Create boundaries for the scene
    const boundaries = [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ];

    // Create the ball
    ball.current = Bodies.circle(cw * 0.2, ch * 0.7, 80, {
      restitution: 0.5,
      friction: 0.005,
      render: {
        fillStyle: '#000000',
      },
    });

    // Create the ramp
    ramp.current = Bodies.rectangle(cw / 2.5, ch * 0.69, cw*1.5, 5, {
      isStatic: true,
      angle: -Math.PI * 0.1, // Adjust the angle of the ramp to your desired slope
      friction: 0.2, // Adjust the friction of the ramp to control the ball's speed
    });

    // Add all bodies to the world
    World.add(engine.current.world, [...boundaries, ball.current, ramp.current]);

    const runner = Runner.create();
    Runner.run(runner, engine.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);
  const handleKeyUp = (e) => {
    if (e.keyCode === 32) {
      setIsSpaceBarPressed(false); // Set the state to false when the space bar is released
    }
  };

  const handleKeyDown = (e) => {
    const decreaseamount = 0.001;
    if (!hasReachedPosition && e.keyCode === 32 && !isSpaceBarPressed) {
      // Apply upward force on the ball when the spacebar is pressed for the first time
      setIsSpaceBarPressed(true); // Set the state to true when the space bar is pressed
      Body.applyForce(ball.current, ball.current.position, { x: movespeed, y: 0 });
      console.log(ball.current.position.y, ramp.current.position.y);
      if (ball.current.position.y < ramp.current.position.y / 2.5) {
        setCurrentspeed((prevspeed) => prevspeed - decreaseamount);
        setShowScript(true);
        setMovespeed(0.05);
        setCurrentScriptIndex((prevIndex) => prevIndex + 1);

        if (currentScriptIndex === scripts.length - 1) {
          setCurrentScriptIndex(0);
        }
        setHasReachedPosition(true);
        setTimeout(() => {
          setHasReachedPosition(false);
        }, 1000);
      }
      if (ball.current.position.y > ramp.current.position.y * 1.1) {
        setMovespeed(currentspeed);
      }
    }
  };
  const renderScript = () => {
    if (showScript) {
      return (
          <motion.div
            className='script-overlay'
            initial={{ opacity: 0, x: -400, y: -350 }}
            animate={{ opacity: 1, x: -270, y: -350 }}
            exit={{ opacity: 0, x: -400, y: -350 }} // Add the exit transition for fade-out
            transition={{ duration: 0.5 }}
            key={currentScriptIndex} // Add a unique key for smoother transitions
          >
            <p>{scripts[currentScriptIndex]}</p>
          </motion.div>
      );
    }
    return (
      <AnimatePresence>
        <motion.div
          className='script-overlay'
          initial={{ opacity: 0, x: -400, y: -350 }}
          animate={{ opacity: 1, x: -270, y: -350 }}
          exit={{ opacity: 0, x: -400, y: -350 }} // Add the exit transition for fade-out
          transition={{ duration: 1 }}
          key={-1} // Add a unique key for smoother transitions
        >
          <p>Ah, welcome to the eternal struggle of Sisyphus! Congratulations on signing up for a task so futile, you might as well be pushing a boulder uphill in your daily 9 to 5 grind! But hey, who am I to judge? Just keep pushing that ball up the ramp, and let's relive Sisyphus's eternal joy</p>
        </motion.div>
      </AnimatePresence>
    );
  };
  const scripts = ["Congrats! You reached the top! But remember, it only goes down from here. Just like that exam you aced!",
  "Look who's back! Pushing uphill, huh? The only thing getting higher is your frustration!",
  "Impressive! But you know, persistence doesn't pay the bills. Keep climbing!",
  "You're getting better at this! But the ball's getting heavier. Just like your workload!",
  "And the ball rolls back down! Can't help but laugh at the irony! ",
  "You've got perseverance, I'll give you that. The ball's got gravity, though!",
  "Pushing, pushing, pushing... Maybe one day it'll stay up! Probably not.",
  "I bet you're getting tired. But hey, the ball isn't!",
  "They say doing the same thing and expecting different results is madness. But I say it's just you!",
  "Look at you go! A true modern-day Sisyphus, pushing that boulder of a ball!",
  "Is there an award for 'Most Persistent Sisyphus'? Because you'd be a strong contender!",
  "The boulder's getting heavier, but your determination's still impressive.",
  "You must love the uphill struggle. Just like the struggle of paying off those student loans!",
  "Can't blame you for trying. Even if the ball's got other plans.",
  "One step closer to a futile world record!",
  "And there it goes, back to square one. But don't worry, it's not like time's a precious resource or anything!"];

  return (
    <div className='app'
      style={{ width: '100vw', height: '95vh' }}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <h3>Press the spacebar to make the ball jump</h3>
      {renderScript()}
      <div className='scene' ref={scene} />
    </div>
  );
}

export default App;
