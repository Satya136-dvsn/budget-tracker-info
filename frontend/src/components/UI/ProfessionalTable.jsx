import React from 'react';
import PropTypes from 'prop-types';

const ProfessionalTable = ({ 
  columns = [],
  data = [],
  onRowClick,
  className = '',
  ...props 
}) => {
  return (
    <div className="professional-table-container">
      <table className={`professional-table ${className}`} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key || index} style={{ width: column.width }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column, colIndex) => (
                <td key={column.key || colIndex}>
                  {column.render 
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="professional-table-empty">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

ProfessionalTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.string,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  className: PropTypes.string
};

export default ProfessionalTable;