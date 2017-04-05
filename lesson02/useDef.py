def oneArgument(num):
    if not isinstance(num, (int, float)):
        raise TypeError('bad operand type')
    return 'you input:', num


a, b = oneArgument(434.32)
print(a, b)


# default argument
def defaultArgument(num, n=2):
    return num * n


print('use default argument, 3*2(default)=', defaultArgument(3))


# use 可变参数个数
# *类似ES7中的扩散运算符...
def mutableArgu(*num):
    sum = 0
    for n in num:
        sum = sum + n * n
    return sum


print('参数个数可变的函数, mutableArgu(3,4,5,6,7)=', mutableArgu(3, 4, 5, 6, 7))


# 关键字参数
def dictArgu(name, **other):
    return 'hello ' + name, other


print(dictArgu('berlin'))


# 命名关键字参数
def keywordArgu(name, *, age):
    return 'hello ' + name, 'age: ' + str(age)


print(keywordArgu('Berlin', age=30))


# use map
def f(x):
    return x * x


print(list(map(f, [1, 2, 3, 4, 5, 6, 7])))
