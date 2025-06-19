export function shuffleArray(array) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled;
}

export function incrementCapitalsIdx(ctx) {
    ctx.session.capitalsIdx++;
    if (ctx.session.capitalsQuestions.length <= ctx.session.capitalsIdx) {
        ctx.session.capitalsIdx = 0;
    }
}

export function incrementCountryPhotoIdx(ctx) {
    ctx.session.countryPhotoIdx++;
    if (ctx.session.countryPhotoQuestions.length <= ctx.session.countryPhotoIdx) {
        ctx.session.countryPhotoIdx = 0;
    }
}

export function incrementFlagsIdx(ctx) {
    ctx.session.flagsIdx++;
    if (ctx.session.flagsQuestions.length <= ctx.session.flagsIdx) {
        ctx.session.flagsIdx = 0;
    }
}

export function incrementCountryMapIdx(ctx) {
    ctx.session.countryMapIdx++;
    if (ctx.session.countryMapQuestions.length <= ctx.session.countryMapIdx) {
        ctx.session.countryMapIdx = 0;
    }
}
