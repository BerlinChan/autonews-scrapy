# this is a comment line

# this is a long comment
# and it extend
# to multiple lines

"""
This is also a
perfect example of
multi-line comments
"""


def double(num):
    """a doc in def, this is a function like in JS"""
    return 2 * num


a = 1 + 2 + 3
b, d, e = 4, 5, 'asdf'
x = y = z = 'same str'
print(a, double(a), double.__doc__, b, d, e, x, y, z)

a2 = 2
b2 = 2.3
c2 = 'some string'


def asdf2(num):
    return num


print(type(a2), type(b2), type(c2), type(asdf2))

# python list, like Array in JS
a3 = [1, 2, 3, 4, 5, 6, 7, 'asdf']
print(a3, a3[0], a3[4], a3[:2], a3[5:])

# python tuple
# tuple is an ordered sequence of items same as list
a4 = (1, 3, 6, 1 + 3j, 'program')
print(a4)

# python strings
a5 = 'hello world'
b5 = '''multi
line string'''
print(a5, b5)
