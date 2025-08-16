import { Package } from 'lucide-react'

const NoItemsFound = ({navigate}) => {
    return (
        <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse different categories
            </p>
            <button
                onClick={() => navigate('/marketplace/add-item')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                List the First Item
            </button>
        </div>
    )
}

export default NoItemsFound
