import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';

export default function ProjectCard({ project, onClick }) {
    // derive some metrics from tasks relationship
    const totalTasks = project.tasks ? project.tasks.length : 0;
    const completedCount = project.tasks
        ? project.tasks.filter((t) => t.status === 'completed').length
        : 0;
    const progress = totalTasks ? (completedCount / totalTasks) * 100 : 0;
    const remaining = totalTasks - completedCount;

    return (
        <div
            onClick={onClick}
            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
        >
            <h3 className="font-semibold">{project.title || project.name}</h3>
            <div className="mt-2">
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    className="h-2 rounded"
                />
            </div>
            <p className="mt-2 text-sm text-gray-500">
                {remaining} tasks remaining
            </p>
        </div>
    );
}

ProjectCard.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        name: PropTypes.string,
        tasks: PropTypes.arrayOf(
            PropTypes.shape({
                status: PropTypes.string,
            }),
        ),
    }).isRequired,
    onClick: PropTypes.func,
};

ProjectCard.defaultProps = {
    onClick: () => {},
};
