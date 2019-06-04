package com.advicecoach.tools.generator.data.onboarding;

import com.advicecoach.common.datamodel.collection.OnBoarding;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 4/2/2017.
 */
public class OnBoardingGen  extends BaseGenerator {
    @Test
    public void testGen() {
        OnBoarding onBoarding = new OnBoarding();
        onBoarding.setTitle("How To Choose After Photo");
        onBoarding.setSubtitle("Capture, share and celebrate your progress");
        onBoarding.setVideoUrl("https://www.youtube.com/watch?v=At47oE5wtY8");
        onBoarding.addKeyTakeaway("1. You take an After Photo to capture your progress.");
        onBoarding.addKeyTakeaway("2. You can share your Before and After photos publicly or privately and then continue toward your goal.");

        gen(onBoarding);
    }
}
