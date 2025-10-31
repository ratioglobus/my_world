import { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import type { ProjectStep } from "../types/ProjectStep";
import "../style/ProjectSteps.css";

type ProjectStepsProps = {
  projectId: string;
  userId: string;
};

export default function ProjectSteps({ projectId, userId }: ProjectStepsProps) {
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [newStep, setNewStep] = useState("");

  const fetchSteps = async () => {
    const { data, error } = await supabase
      .from("project_steps")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setSteps(data || []);
  };

  useEffect(() => {
    fetchSteps();
  }, [projectId]);

  const addStep = async () => {
    if (!newStep.trim()) return;
    const { data, error } = await supabase
      .from("project_steps")
      .insert([{ title: newStep.trim(), project_id: projectId, user_id: userId }])
      .select();

    if (error) console.error(error);
    else setSteps((prev) => [...prev, data[0]]);
    setNewStep("");
  };

  const toggleStep = async (stepId: string, completed: boolean) => {
    const { error } = await supabase
      .from("project_steps")
      .update({ completed })
      .eq("id", stepId);

    if (error) console.error(error);
    else setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, completed } : s))
    );
  };

  const deleteStep = async (stepId: string) => {
    const { error } = await supabase
      .from("project_steps")
      .delete()
      .eq("id", stepId);

    if (error) console.error(error);
    else setSteps((prev) => prev.filter((s) => s.id !== stepId));
  };

  const progress = useMemo(() => {
    if (steps.length === 0) return 0;
    const completedCount = steps.filter((s) => s.completed).length;
    return Math.round((completedCount / steps.length) * 100);
  }, [steps]);

  return (
    <div className="project-steps">
      <h3 className="steps-title">Шаги проекта</h3>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">{progress}%</span>
      </div>

      <ul className="steps-list">
        {steps.map((step) => (
          <li key={step.id} className={`step-item ${step.completed ? "done" : ""}`}>
            <label>
              <input
                type="checkbox"
                checked={step.completed}
                onChange={() => toggleStep(step.id, !step.completed)}
              />
              {step.title}
            </label>
            <button className="delete-step" onClick={() => deleteStep(step.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="add-step-row">
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Добавить новый шаг..."
          className="add-step-input"
        />
        <button onClick={addStep} className="add-step-btn">＋</button>
      </div>
    </div>
  );
}
