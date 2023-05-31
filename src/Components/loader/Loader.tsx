import { ColorRing } from 'react-loader-spinner';
import './loader.css'

const LoaderCustom = () => {
    return (
        <div className={'loader-modal'}>
            <ColorRing
              visible={true}
              height="150"
              width="150"
              wrapperClass="blocks-wrapper"
              colors={['rgba(91, 73, 253, 0.208)', 'rgba(91, 73, 253, 0.208)', 'rgba(91, 73, 253, 0.208)', 'rgba(91, 73, 253, 0.208)', 'rgba(91, 73, 253, 0.208)']}
            />
        </div>
    );
}

export default LoaderCustom;
