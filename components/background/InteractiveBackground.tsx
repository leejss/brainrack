"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2, Color } from "ogl";
import { vertexShader, fragmentShader } from "./shaders";

interface BackgroundProps {
  className?: string;
}

export default function InteractiveBackground({ className }: BackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize Renderer
    const renderer = new Renderer({ 
      dpr: 2,
      alpha: true,
      depth: false 
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    // Initial Resize
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", resize);
    resize();

    // Setup Program
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0.22, 1.0, 0.08) },
        uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
        uMouse: { value: new Vec2(0, 0) },
      },
    });

    // Setup Mesh
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    // Mouse Interaction
    const mouse = new Vec2(0, 0);
    const handleMouseMove = (e: MouseEvent) => {
      // Invert Y to match GL coords
      mouse.set(e.clientX, window.innerHeight - e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationId: number;
    const update = (t: number) => {
      animationId = requestAnimationFrame(update);

      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
      program.uniforms.uMouse.value.copy(mouse);

      renderer.render({ scene: mesh });
    };
    animationId = requestAnimationFrame(update);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
      container.removeChild(gl.canvas);
      // Optional: dispose resources if needed
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ width: "100%", height: "100%" }} 
    />
  );
}
