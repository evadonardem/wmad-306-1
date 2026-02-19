export default function RightSidebar() {
    const suggestions = [
        { name: 'John Manager', role: 'Project Manager', avatar: 'J' },
        { name: 'Sarah Designer', role: 'UI Designer', avatar: 'S' },
        { name: 'Mike Developer', role: 'Backend Dev', avatar: 'M' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
            <h3 className="font-bold text-gray-900 mb-4">People You May Know</h3>

            <div className="space-y-3">
                {suggestions.map((person, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {person.avatar}
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900">{person.name}</p>
                                <p className="text-xs text-gray-500">{person.role}</p>
                            </div>
                        </div>
                        <button className="text-blue-600 text-xs font-bold hover:text-blue-700">Add</button>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active Tasks</span>
                        <span className="font-bold text-blue-600">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Team Members</span>
                        <span className="font-bold text-blue-600">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completed Today</span>
                        <span className="font-bold text-green-600">5</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
