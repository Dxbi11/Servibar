import React, { useRef } from "react";

export const useRefresh = () => {
    const refreshTable = useRef(null);

    const handleRefresh = () => {
        if (refreshTable.current) {
            refreshTable.current.refresh();
        }
    };

    return { refreshTable, handleRefresh };
};
