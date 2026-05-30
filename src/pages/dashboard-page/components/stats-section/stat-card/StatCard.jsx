import './stat-card.scss';

const StatCard = ({ statData }) => {
    const { title, contents } = statData;

    return (
        <div className='stat-data'>
            <div className='stat-data-title'>{ title }</div>
            <div className='stat-data-contents'>
                { contents.map((content, index) => (
                    <div key={`content-${title}-${index}`}>
                        { content.toLocaleString() }
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatCard;