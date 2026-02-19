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

    return (
        <div className="project-grid">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="project-card"
                    onMouseMove={handleCardMove}
                    style={{
                        "--card-border": "#3B82F6",
                        "--card-gradient": "linear-gradient(145deg, #2563eb, #111827)",
                    }}
                >
                    <div className="project-title">{project.title}</div>

                    <div className="project-desc">
                        {project.description || "No description provided."}
                    </div>

                    <div className="project-meta">
                        <span className="project-pill">Active</span>
                        <span className="project-pill">
                            ID: {project.id}
                        </span>
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
            ))}
        </div>
    );
}
