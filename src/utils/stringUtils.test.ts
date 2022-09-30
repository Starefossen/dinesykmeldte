import { cleanIda } from './stringUtils';

describe('cleanId', () => {
    it('should clean normal text', () => {
        expect(cleanIda('Hello yes this is normal text. Some punctuation?')).toEqual(
            'Hello_yes_this_is_normal_text__Some_punctuation_',
        );
    });
});
