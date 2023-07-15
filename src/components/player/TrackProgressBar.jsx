
export const TrackProgressBar = ({ progress, duration, onSeek }) => {

    const formatDuration = duration => {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleProgressBarChange = e => {
        const newPosition = parseInt(e.target.value, 10);
        onSeek(newPosition);
    };

    return (
        <div className="flex gap-4">
            <div>
                {formatDuration(progress)}
            </div>
            <input
                type="range"
                value={progress}
                min={0}
                max={duration}
                step={1000}
                onChange={handleProgressBarChange}
                className="w-[400px]"
            />
            <div>
                {formatDuration(duration)}
            </div>
        </div>
    );
};