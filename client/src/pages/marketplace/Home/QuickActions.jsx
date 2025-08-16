import { Package, Plus } from 'lucide-react'
import React from 'react'

const QuickActions = ({navigate}) => {
    return (

        < div className="fixed bottom-6 right-6 space-y-3" >
            <button
                onClick={() => navigate('/marketplace/my-items')}
                className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
                title="My Items"
            >
                <Package size={20} />
            </button>
            <button
                onClick={() => navigate('/marketplace/add-item')}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                title="Sell Item"
            >
                <Plus size={20} />
            </button>
        </div >

    )
}

export default QuickActions
