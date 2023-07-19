import { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";


export default function TermsAndServices({ navigation }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>

            <Text style={styles.title}>
                شروط واشتراطات الاستخدام

            </Text>
            <Text style={styles.title}>
                1. الشروط

            </Text>
            <Text style={styles.text}>
                من خلال الوصول إلى هذا الموقع ، الذي يمكن الوصول إليه من Vinkst ، فإنك توافق على الالتزام بشروط وأحكام استخدام موقع الويب هذه وتوافق على أنك مسؤول عن الاتفاقية مع أي قوانين محلية معمول بها. إذا كنت لا توافق على أي من هذه الشروط ، فيُحظر عليك الوصول إلى هذا الموقع. المواد الواردة في هذا الموقع محمية بموجب قانون حقوق النشر والعلامات التجارية.

            </Text>
            <Text style={styles.title}>
                2. ترخيص الاستخدام

            </Text>
            <Text style={styles.text}>
                يُمنح الإذن لتنزيل نسخة واحدة من المواد مؤقتًا على موقع Vinkst للعرض الشخصي غير التجاري العابر فقط. هذا هو منح الترخيص ، وليس نقل الملكية ، وبموجب هذا الترخيص لا يجوز لك:
            </Text>
            <Text style={[styles.text, styles.textLine]}>
                تعديل أو نسخ المواد ؛
            </Text>
            <Text style={[styles.text, styles.textLine]}>
                استخدام المواد لأي غرض تجاري أو لأي عرض عام ؛

            </Text>
            <Text style={[styles.text, styles.textLine]}>
                محاولة عكس هندسة أي برنامج موجود على موقع Vinkst ؛

            </Text>

            <Text style={[styles.text, styles.textLine]}>
                إزالة أي حقوق التأليف والنشر أو غيرها من تدوينات الملكية من المواد ؛ أو

            </Text>

            <Text style={[styles.text, styles.textLine]}>
                نقل المواد إلى شخص آخر أو "نسخ" المواد الموجودة على أي خادم آخر.

            </Text>

            <Text style={styles.text}>
                سيسمح هذا لـ Vinkst بالإنهاء عند انتهاك أي من هذه القيود. عند الإنهاء ، سيتم أيضًا إنهاء حق المشاهدة الخاص بك ويجب عليك تدمير أي مواد تم تنزيلها في حوزتك سواء كانت مطبوعة أو بتنسيق إلكتروني. تم إنشاء شروط الخدمة هذه بمساعدة منشئ شروط الخدمة.

            </Text>




            <Text style={styles.title}>
                3. إخلاء المسؤولية

            </Text>
            <Text style={styles.text}>
                يتم توفير جميع المواد الموجودة على موقع Vinkst "كما هي". لا تقدم Vinkst أي ضمانات ، صريحة أو ضمنية ، وبالتالي تنفي جميع الضمانات الأخرى. علاوة على ذلك ، لا تقدم Vinkst أي تعهدات تتعلق بدقة أو موثوقية استخدام المواد الموجودة على موقعها على الويب أو فيما يتعلق بهذه المواد أو أي مواقع مرتبطة بهذا الموقع.

            </Text>

            <Text style={styles.title}>
                4. القيود

            </Text>
            <Text style={styles.text}>
                لن تتحمل Vinkst أو مورديها المسؤولية عن أي أضرار قد تنشأ عن استخدام أو عدم القدرة على استخدام المواد الموجودة على موقع Vinkst ، حتى لو تم إخطار Vinkst أو ممثل مفوض لهذا الموقع ، شفهيًا أو كتابيًا ، بإمكانية مثل هذا الضرر. لا تسمح بعض السلطات القضائية بفرض قيود على الضمانات الضمنية أو قيود المسؤولية عن الأضرار العرضية ، وقد لا تنطبق هذه القيود عليك.

            </Text>

            <Text style={styles.title}>
                5. التنقيحات
            </Text>
            <Text style={styles.text}>
                قد تتضمن المواد التي تظهر على موقع Vinkst على الويب أخطاء فنية أو مطبعية أو فوتوغرافية. لن تعد Vinkst بأن أيًا من المواد الموجودة في هذا الموقع دقيقة أو كاملة أو حديثة. قد تقوم Vinkst بتغيير المواد الموجودة على موقعها الإلكتروني في أي وقت دون إشعار مسبق. لا تقدم Vinkst أي التزام بتحديث المواد.

            </Text>

            <Text style={styles.title}>
                6. الروابط

            </Text>
            <Text style={styles.text}>
                لم تقم Vinkst بمراجعة جميع المواقع المرتبطة بموقعها على الويب وليست مسؤولة عن محتويات أي موقع مرتبط من هذا القبيل. إن وجود أي رابط لا يعني موافقة Vinkst على الموقع. يتحمل المستخدم مسؤولية استخدام أي موقع مرتبط.

            </Text>

            <Text style={styles.title}>
                7. تعديلات شروط استخدام الموقع

            </Text>
            <Text style={styles.text}>
                قد تقوم Vinkst بمراجعة شروط الاستخدام لموقعها على الويب في أي وقت دون إشعار مسبق. باستخدام هذا الموقع ، فإنك توافق على الالتزام بالإصدار الحالي من شروط وأحكام الاستخدام هذه.

            </Text>

            <Text style={styles.title}>
                8. خصوصيتك

            </Text>
            <Text style={styles.text}>
                يرجى قراءة سياسة الخصوصية.

            </Text>

            <Text style={styles.title}>
                9. القانون الحاكم

            </Text>

            <Text style={styles.text}>
                تخضع أي مطالبة تتعلق بموقع Vinkst الإلكتروني لقوانين af بغض النظر عن تعارضها مع أحكام القانون.
            </Text>
            
            </View>
        </ScrollView>
    )
}


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
   

    },

    content : {
        padding : 16 , 
        paddingTop : 56 
    } , 


    title: {
        fontWeight: "bold",
        fotnSize: 16,
        color: "#212121",
        marginVertical: 16 , 
    },

    text: {
        fontSize: 14,
        color: "#555"
    },
    textLine: {
        color: "#212121",
        fontWeight: "bold",
        paddingRight: 8,
        marginBottom: 12
    }
}) ; 


const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor,
   

    },
    
    title: {
        fontWeight: "bold",
        fotnSize: 16,
        color : darkTheme.textColor , 
        marginVertical: 16 , 
    },  
    text: {
        fontSize: 14,
        color: darkTheme.secondaryTextColor
    },
    textLine: {
        color: darkTheme.textColor ,
        fontWeight: "bold",
        paddingRight: 8,
        marginBottom: 12
    }
}