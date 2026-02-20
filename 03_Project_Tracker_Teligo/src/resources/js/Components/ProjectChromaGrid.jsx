import "./ProjectChromaGrid.css";

export default function ProjectChromaGrid({ projects, onView, onDelete }) {

    const handleCardMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };

    const getProgressColor = (percent) => {
        if (percent >= 80) return "linear-gradient(90deg, #22c55e, #16a34a)";
        if (percent >= 40) return "linear-gradient(90deg, #facc15, #eab308)";
        return "linear-gradient(90deg, #ef4444, #dc2626)";
    };

    return (
        <div className="project-grid">
            {projects.map((project) => {
                const totalTasks = project.tasks_count || 0;
                const doneTasks = project.done_tasks_count || 0;
                const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

                return (
                    <div
                        key={project.id}
                        className="project-card"
                        onMouseMove={handleCardMove}
                        style={{
                            "--card-border": percent === 100 ? "#22c55e" : "#3B82F6",
                            "--card-gradient": percent === 100
                                ? "linear-gradient(145deg, #16a34a, #052e16)"
                                : "linear-gradient(145deg, #2563eb, #111827)",
                        }}
                    >
                        <div className="project-title">{project.title}</div>

                        <div className="project-desc">
                            {project.description || "No description provided."}
                        </div>

                        <div className="project-meta">
                            <span className="project-pill">
                                {percent === 100 ? "Completed ✅" : "Active"}
                            </span>

                            <span className="project-pill">
                                Tasks: {doneTasks}/{totalTasks}
                            </span>
                        </div>

                        {/* ✅ Progress Bar */}
                        <div style={{ marginTop: "12px", marginBottom: "14px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.85rem",
                                    opacity: 0.85,
                                    marginBottom: "6px",
                                }}
                            >
                                <span>Progress</span>
                                <span>{percent}%</span>
                            </div>

                            <div
                                style={{
                                    width: "100%",
                                    height: "10px",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.15)",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${percent}%`,
                                        borderRadius: "999px",
                                        background: getProgressColor(percent),
                                        transition: "0.4s ease",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="project-actions">
                            <button
                                className="project-btn view"
                                onClick={() => onView(project.id)}
                            >
                                View
                            </button>

                            <button
                                className="project-btn delete"
                                onClick={() => onDelete(project.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
