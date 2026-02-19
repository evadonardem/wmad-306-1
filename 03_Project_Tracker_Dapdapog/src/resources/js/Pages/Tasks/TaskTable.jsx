import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';

export default function TaskTable({ tasks, showProject = false, onToggleStatus, onEdit, onDelete }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {showProject && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Project
                            </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-100 transition">
                            {showProject && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {t.projectTitle}
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {t.assignee}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <Switch
                                    checked={t.status}
                                    size="small"
                                    onChange={() => onToggleStatus(t.id)}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {t.priority}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {t.due}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(t)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(t)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

TaskTable.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            assignee: PropTypes.string,
            status: PropTypes.bool,
            priority: PropTypes.string.isRequired,
            due: PropTypes.string.isRequired,
            projectTitle: PropTypes.string,
            projectId: PropTypes.number,
        }),
    ).isRequired,
    showProject: PropTypes.bool,
    onToggleStatus: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

TaskTable.defaultProps = {
    showProject: false,
    onToggleStatus: () => {},
    onEdit: () => {},
    onDelete: () => {},
};
